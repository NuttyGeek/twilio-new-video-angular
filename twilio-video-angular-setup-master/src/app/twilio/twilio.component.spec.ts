import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioComponent } from './twilio.component';

describe('TwilioComponent', () => {
  let component: TwilioComponent;
  let fixture: ComponentFixture<TwilioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwilioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
