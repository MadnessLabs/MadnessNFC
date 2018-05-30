import { Component, Listen, Prop, State } from "@stencil/core";

import { APIService } from "../../services/api";
import { AuthService } from "../../services/auth";
import { ConfigService } from "../../services/config";
import { DatabaseService } from "../../services/database";

@Component({
  tag: "madness-nfc",
  styleUrl: "madness-nfc.scss"
})
export class MadnessNFC {
  @Prop({ context: "isServer" })
  private isServer: boolean;

  @State() public config: ConfigService;
  @State() public auth: AuthService;
  @State() public api: APIService;
  @State() public db: DatabaseService;
  @State()
  public defaultProps: {
    config: ConfigService;
    auth: AuthService;
    session: MadnessNFC.User.ISession;
    api: APIService;
    db: DatabaseService;
  };
  @State() public nfc: any;
  @State() public ndef: any;

  /**
   * Handle service worker updates correctly.
   * This code will show a toast letting the
   * user of the PWA know that there is a
   * new version available. When they click the
   * reload button it then reloads the page
   * so that the new service worker can take over
   * and serve the fresh content
   */
  @Listen("window:swUpdate")
  public async onSWUpdate() {
    if (localStorage.getItem("referaflood:lastVisit")) {
      // const toast = await this.toastCtrl.create({
      //   message: 'New version available',
      //   showCloseButton: true,
      //   closeButtonText: 'Reload',
      // });
      // await toast.present();
      // await toast.onWillDismiss();
      window.location.reload();
    } else {
      localStorage.setItem("referaflood:lastVisit", new Date().toISOString());
    }
  }

  public componentWillLoad() {
    if (!this.isServer) {
      this.config = new ConfigService();
      const app = this.config.get("app");
      this.auth = new AuthService(this.config.get("firebase"));
      this.api = new APIService({ host: app.apiUrl });
      this.db = new DatabaseService();

      this.defaultProps = {
        config: this.config,
        auth: this.auth,
        session: null,
        api: this.api,
        db: this.db
      };
    }
  }

  public componentDidLoad() {
    if (!this.isServer) {
      this.auth.onAuthChanged((session: MadnessNFC.User.ISession) => {
        console.log(session);
        this.defaultProps = { ...this.defaultProps, session };
      });
    }
  }

  render() {
    return <div>This is awesome!</div>;
  }
}
