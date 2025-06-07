import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController } from "@ionic/angular";
import { AlertService } from "src/app/shared/services/alert.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
  standalone: false,
})
export class ForgotPasswordComponent implements OnInit {
  forgotPwdForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.forgotPwdForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.forgotPwdForm.markAllAsTouched();
    this.forgotPwdForm.markAsDirty();
    if (this.forgotPwdForm.valid) {
      this.resetPassword(this.forgotPwdForm.value.email);
    }
  }

  async resetPassword(email: string) {
    await this.alertService.showLoader("Sending reset email...");

    try {
      await this.authService.resetPassword(email);
      await this.alertService.showToast(
        "Password reset email sent. Check your inbox.",
        "success"
      );
      this.forgotPwdForm.reset();
      this.navigateToLogin();
    } catch (error) {
      console.error("Password reset error:", error);
      this.alertService.showToast(
        "Could not send reset email. Please try again.",
        "danger"
      );
    } finally {
      await this.alertService.hideLoader();
    }
  }

  navigateToLogin() {
    this.navCtrl.navigateBack("/auth/login");
  }
}
