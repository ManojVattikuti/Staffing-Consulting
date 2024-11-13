import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfromBusinessComponent } from './transfrom-business.component';

describe('TransfromBusinessComponent', () => {
  let component: TransfromBusinessComponent;
  let fixture: ComponentFixture<TransfromBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfromBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfromBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
