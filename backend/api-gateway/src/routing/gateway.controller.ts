import {
  All,
  BadGatewayException,
  Controller,
  Get,
  NotFoundException,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { serviceFetch, serviceOrigin } from "../../../shared/service-http";
// gồm các API mà frontend gọi
const routes = [
  // Catalog-service
  {
    method: "GET",
    path: /^\/(products|categories)$/,
    service: "catalog",
    port: 3002,
  },
  // Inventory-service
  { method: "GET", path: /^\/stock$/, service: "inventory", port: 3003 },
  // Sales-service
  {
    method: "GET",
    path: /^\/orders(?:\/[0-9a-f-]{36})?$/,
    service: "sales",
    port: 3004,
  },
  { method: "POST", path: /^\/orders$/, service: "sales", port: 3004 },
  // Shipping-service
  {
    method: "GET",
    path: /^\/(carriers|shipments)$/,
    service: "shipping",
    port: 3005,
  },
  // Supply-service
  {
    method: "GET",
    path: /^\/(suppliers|receipts)$/,
    service: "supply",
    port: 3006,
  },
  // Reporting-service
  {
    method: "GET",
    path: /^\/sales-reports$/,
    service: "reporting",
    port: 3007,
  },
  // Indentity-service
  { method: "GET", path: /^\/roles$/, service: "identity", port: 3001 },
];

@Controller("api")
export class GatewayController {
  @Get("health")
  health() {
    return { service: "api-gateway", status: "ok" };
  }

  @All("{*path}")
  async forward(@Req() request: Request, @Res() response: Response) {
    const path = request.path.slice("/api".length);
    const route = routes.find(
      (entry) => entry.method === request.method && entry.path.test(path),
    );
    if (!route) {
      throw new NotFoundException("Endpoint không tồn tại.");
    }

    const target = new URL(path, serviceOrigin(route.service, route.port));
    const upstream = await serviceFetch(target, {
      method: request.method,
      headers: { "content-type": "application/json" },
      body:
        request.method === "POST"
          ? JSON.stringify(request.body ?? {})
          : undefined,
    });

    const contentType = upstream.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new BadGatewayException("Phản hồi nội bộ không hợp lệ.");
    }
    response
      .status(upstream.status)
      .type("application/json")
      .send(await upstream.text());
  }
}
