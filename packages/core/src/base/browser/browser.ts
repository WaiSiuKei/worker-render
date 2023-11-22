/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { Emitter, Event } from '../common/event';
import { Disposable, markAsSingleton } from '../common/lifecycle';

/**
 * See https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#monitoring_screen_resolution_or_zoom_level_changes
 */
class DevicePixelRatioMonitor extends Disposable {
  private readonly _onDidChange = this._register(new Emitter<void>());
  public readonly onDidChange = this._onDidChange.event;

  private readonly _listener: () => void;
  private _mediaQueryList: MediaQueryList | null;

  constructor() {
    super();

    this._listener = () => this._handleChange(true);
    this._mediaQueryList = null;
    this._handleChange(false);
  }

  private _handleChange(fireEvent: boolean): void {
    if (this._mediaQueryList) {
      this._mediaQueryList.removeEventListener('change', this._listener);
    }

    this._mediaQueryList = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    this._mediaQueryList.addEventListener('change', this._listener);

    if (fireEvent) {
      this._onDidChange.fire();
    }
  }
}

class PixelRatioImpl extends Disposable {
  private readonly _onDidChange = this._register(new Emitter<number>());
  public readonly onDidChange = this._onDidChange.event;

  private _value: number;

  public get value(): number {
    return this._value;
  }

  constructor() {
    super();

    this._value = this._getPixelRatio();

    const dprMonitor = this._register(new DevicePixelRatioMonitor());
    this._register(
      dprMonitor.onDidChange(() => {
        this._value = this._getPixelRatio();
        this._onDidChange.fire(this._value);
      }),
    );
  }

  private _getPixelRatio(): number {
    const ctx: any = document.createElement('canvas').getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;
    return dpr / bsr;
  }
}

class PixelRatioFacade {
  private _pixelRatioMonitor: PixelRatioImpl | null = null;
  private _getOrCreatePixelRatioMonitor(): PixelRatioImpl {
    if (!this._pixelRatioMonitor) {
      this._pixelRatioMonitor = markAsSingleton(new PixelRatioImpl());
    }
    return this._pixelRatioMonitor;
  }

  /**
   * Get the current value.
   */
  public get value(): number {
    return this._getOrCreatePixelRatioMonitor().value;
  }

  /**
   * Listen for changes.
   */
  public get onDidChange(): Event<number> {
    return this._getOrCreatePixelRatioMonitor().onDidChange;
  }
}

export function addMatchMediaChangeListener(
  query: string | MediaQueryList,
  callback: (this: MediaQueryList, ev: MediaQueryListEvent) => any,
): void {
  if (typeof query === 'string') {
    query = window.matchMedia(query);
  }
  query.addEventListener('change', callback);
}

/**
 * Returns the pixel ratio.
 *
 * This is useful for rendering <canvas> elements at native screen resolution or for being used as
 * a cache key when storing font measurements. Fonts might render differently depending on resolution
 * and any measurements need to be discarded for example when a window is moved from a monitor to another.
 */
export const PixelRatio = new PixelRatioFacade();

const userAgent = navigator.userAgent;

export const isIE = (userAgent.indexOf('Trident') >= 0);
export const isEdge = (userAgent.indexOf('Edge/') >= 0);
export const isEdgeOrIE = isIE || isEdge;

export const isFirefox = (userAgent.indexOf('Firefox') >= 0);
export const isWebKit = (userAgent.indexOf('AppleWebKit') >= 0);
export const isChrome = (userAgent.indexOf('Chrome') >= 0);
export const isSafari = (!isChrome && (userAgent.indexOf('Safari') >= 0));
export const isWebkitWebView = (!isChrome && !isSafari && isWebKit);
export const isElectron = (userAgent.indexOf('Electron/') >= 0);
export const isAndroid = (userAgent.indexOf('Android') >= 0);
export const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
