/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../common/lifecycle';
import { IMessagePassingProtocol, IPCClient, IPCDataPackage } from './ipc';
import { Event } from '../../common/event';

/**
 * The MessagePort `Protocol` leverages MessagePort style IPC communication
 * for the implementation of the `IMessagePassingProtocol`. That style of API
 * is a simple `onmessage` / `postMessage` pattern.
 */
export class Protocol implements IMessagePassingProtocol {

  readonly onMessage: Event<IPCDataPackage>;

  constructor(private port: MessagePort) {

    // we must call start() to ensure messages are flowing
    port.start();
    this.onMessage = Event.fromDOMEventEmitter(this.port, 'message', (e: MessageEvent) => e.data);
  }

  send(message: IPCDataPackage): void {
    this.port.postMessage(message);
  }

  disconnect(): void {
    this.port.close();
  }
}

/**
 * An implementation of a `IPCClient` on top of MessagePort style IPC communication.
 */
export class Client extends IPCClient implements IDisposable {
  private protocol: Protocol;

  constructor(port: MessagePort, clientId: string) {
    const protocol = new Protocol(port);
    super(protocol, clientId);

    this.protocol = protocol;
  }

  override dispose(): void {
    this.protocol.disconnect();
  }
}
