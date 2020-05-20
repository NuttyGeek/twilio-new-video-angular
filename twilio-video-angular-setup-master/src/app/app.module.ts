import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TwilioService } from './twilio/services/twilio.service';
import { AppComponent } from './app.component';
import { TwilioComponent } from './twilio/twilio.component';
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';
import { NewTwilioComponent } from './new-twilio/new-twilio.component';
import { SecondService } from './twilio/services/second.service';

const routes: Routes = [{
  path: '',
  component: TwilioComponent
}, {
  path: 'new',
  component: NewTwilioComponent
}]

@NgModule({
  declarations: [
    AppComponent,
    TwilioComponent,
    NewTwilioComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [TwilioService, SecondService],
  bootstrap: [AppComponent]
})
export class AppModule { }
