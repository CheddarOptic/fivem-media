import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  
  @Injectable()
  export class ApiKeyAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
  
      const apiKey = request.headers['x-api-key'];
      
      if (apiKey === process.env.API_KEY) {
        return true;
      }
      
      throw new UnauthorizedException('Invalid API key');
    }
  }
  