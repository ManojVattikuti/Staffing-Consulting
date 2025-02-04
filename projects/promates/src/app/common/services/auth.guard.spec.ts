import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthGuard', () => {
  let executeGuard: AuthGuard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AuthGuard, provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    executeGuard = TestBed.inject(AuthGuard);
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
