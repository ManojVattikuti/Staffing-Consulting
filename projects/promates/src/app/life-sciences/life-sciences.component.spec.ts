import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeSciencesComponent } from './life-sciences.component';

describe('LifeSciencesComponent', () => {
  let component: LifeSciencesComponent;
  let fixture: ComponentFixture<LifeSciencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeSciencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LifeSciencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
