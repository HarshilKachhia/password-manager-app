import { Injectable } from '@angular/core';
import { AlertButton, AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private toastController: ToastController,
    private loaderCtrl: LoadingController,
    private alertController: AlertController
  ) { }

  async showToast(msg: string, color: "success" | "danger" | "warning", position: "top" | "bottom" | "middle" = "bottom", duration: number = 2500) {
    this.toastController.create({
      message: msg,
      duration,
      color: color,
      position,
      buttons: [
        {
          side: 'end', // Places the icon on the right side
          icon: 'close-outline', // Ionicon close icon
          role: 'cancel', // Will dismiss the toast when clicked
          handler: () => { }
        }
      ]
    }).then(toast => {
      toast.present();
    });
  }

  async showLoader(message: string = 'Loading...') {
    const loading = await this.loaderCtrl.create({
      message,
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });
    await loading.present();
    return loading;
  }

  async hideLoader() {
    return this.loaderCtrl.dismiss()
  }
  async showAlert(header: string, message: string, buttons?: AlertButton[]) {
    // Default dismiss button if none provided
    if (!buttons || buttons.length == 0) {
      buttons = [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => { }
        }
      ];
    }
    const alert = await this.alertController.create({
      header,
      message,
      buttons
    });
    await alert.present();
  }
}
