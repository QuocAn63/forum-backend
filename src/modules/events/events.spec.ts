import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { JwtService } from '@nestjs/jwt';

describe('eventsGateway', () => {
  let eventsGateway: EventsGateway;

  eventsGateway = new EventsGateway(new JwtService());

  it('It should be defined.', () => {
    expect(eventsGateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('It should be defined.', () => {
      expect(eventsGateway.handleConnection).toBeDefined();
    });
  });

  describe('handleDisconnect', () => {
    it('It should be defined.', () => {
      expect(eventsGateway.handleDisconnect).toBeDefined();
    });
  });
});
