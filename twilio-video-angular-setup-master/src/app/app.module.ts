import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TwilioService } from './twilio/services/twilio.service';
import { AppComponent } from './app.component';
import { TwilioComponent } from './twilio/twilio.component';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    TwilioComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [TwilioService],
  bootstrap: [TwilioComponent]
})
export class AppModule { }
