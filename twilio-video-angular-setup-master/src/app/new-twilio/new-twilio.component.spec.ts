import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTwilioComponent } from './new-twilio.component';

describe('NewTwilioComponent', () => {
  let component: NewTwilioComponent;
  let fixture: ComponentFixture<NewTwilioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTwilioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTwilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
