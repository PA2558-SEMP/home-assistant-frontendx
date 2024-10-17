import type { HassEntity } from "home-assistant-js-websocket";
import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import "../components/entity/state-info";
import HassMediaPlayerEntity from "../util/hass-media-player-model";
import { HomeAssistant } from "../types";
import { haStyle } from "../resources/styles";

@customElement("state-card-media_player")
class StateCardMediaPlayer extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public stateObj!: HassEntity;

  @property({ type: Boolean }) public inDialog = false;

  protected render(): TemplateResult {
    const playerObj = new HassMediaPlayerEntity(this.hass, this.stateObj);
    return html`
      <div>
        <div class="horizontal justified layout">
          <state-info
            .hass=${this.hass}
            .stateObj=${this.stateObj}
            .inDialog=${this.inDialog}
          ></state-info>
          <div class="state">
            <div class="main-text" take-height=${!playerObj.secondaryTitle}>
              ${this._computePrimaryText(playerObj)}
            </div>
            <div class="secondary-text">${playerObj.secondaryTitle}</div>
          </div>
        </div>
        ${playerObj.nextMedia
          ? html`<div class="media-next">
            <span>
            ${playerObj.nextMedia}
            </span>
          </div>`
          : ""}
      </div>
    `;
  }

  private _computePrimaryText(playerObj) {
    return (
      playerObj.primaryTitle || this.hass.formatEntityState(playerObj.stateObj)
    );
  }

  static get styles(): CSSResultGroup {
    return [
      haStyle,
      css`
        :host {
          line-height: 1.5;
        }

        .state {
          margin-left: 16px;
          margin-inline-start: 16px;
          margin-inline-end: initial;
          text-align: var(--float-end);
        }

        .main-text {
          color: var(--primary-text-color);
        }

        .main-text[take-height] {
          line-height: 40px;
        }

        .secondary-text {
          color: var(--secondary-text-color);
        }

        .media-next {
        margin-top: 1rem;
        font-size: 0.9rem;
        width: 8rem;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        }


        .media-next span {
          display: inline-block;
          padding-left: 0; 
          animation: scroll-text 16s linear infinite;
        }

        @keyframes scroll-text {
          0% {
            transform: translateX(100%);
          }
          70% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }


      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "state-card-media_player": StateCardMediaPlayer;
  }
}
