/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ClientConnectionEvent, IPCServer } from '../common/ipc';
import { Protocol } from '../common/ipc.mp';
import { Event } from '../../common/event';

export type IPCSetupAction = {
  command: IPCSetupCommand
  arg: string
}

export enum IPCSetupCommand {
  createMessageChannel = 'createMessageChannel',
  createMessageChannelResult = 'createMessageChannelResult'
}

/**
 * An implementation of a `IPCServer` on top of MessagePort style IPC communication.
 * The clients register themselves via Electron IPC transfer.
 */
export class Server extends IPCServer {
  private static getOnDidClientConnect(): Event<ClientConnectionEvent> {

    // Clients connect via `vscode:createMessageChannel` to get a
    // `MessagePort` that is ready to be used. For every connection
    // we create a pair of message ports and send it back.
    //
    // The `nonce` is included so that the main side has a chance to
    // correlate the response back to the sender.
    const onCreateMessageChannel = Event.fromDOMEventEmitter<IPCSetupAction | null>(self, 'message', (e: MessageEvent) => e.data);

    return Event.map(Event.filter(onCreateMessageChannel, data => {
      return !!data && data.command === IPCSetupCommand.createMessageChannel;
    }), (input: any) => {

      // Create a new pair of ports and protocol for this connection
      const { port1: incomingPort, port2: outgoingPort } = new MessageChannel();
      const protocol = new Protocol(incomingPort);

      const result: ClientConnectionEvent = {
        protocol,
        // Not part of the standard spec, but in Electron we get a `close` event
        // when the other side closes. We can use this to detect disconnects
        // (https://github.com/electron/electron/blob/11-x-y/docs/api/message-port-main.md#event-close)
        onDidClientDisconnect: Event.fromDOMEventEmitter(incomingPort, 'close')
      };

      // Send one port back to the requestor
      // Note: we intentionally use `electron` APIs here because
      // transferables like the `MessagePort` cannot be transferred
      // over preload scripts when `contextIsolation: true`
      self.postMessage({
        command: IPCSetupCommand.createMessageChannelResult,
        arg: input.arg
      }, {
        transfer: [outgoingPort]
      });

      return result;
    });
  }

  constructor() {
    super(Server.getOnDidClientConnect());
  }
}
