import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSecComponent } from './about-sec.component';

describe('AboutSecComponent', () => {
  let component: AboutSecComponent;
  let fixture: ComponentFixture<AboutSecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
