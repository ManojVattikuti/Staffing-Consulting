import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildBusinessNeedsComponent } from './build-business-needs.component';

describe('BuildBusinessNeedsComponent', () => {
  let component: BuildBusinessNeedsComponent;
  let fixture: ComponentFixture<BuildBusinessNeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildBusinessNeedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildBusinessNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
