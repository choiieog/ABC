import { bootstrap } from '../../../shared/bootstrap';
import { AppModule } from './app.module';

void bootstrap(AppModule, 'identity-service', 3001);
