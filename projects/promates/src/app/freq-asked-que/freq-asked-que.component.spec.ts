import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreqAskedQueComponent } from './freq-asked-que.component';

describe('FreqAskedQueComponent', () => {
  let component: FreqAskedQueComponent;
  let fixture: ComponentFixture<FreqAskedQueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreqAskedQueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreqAskedQueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
