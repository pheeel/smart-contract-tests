import { ElementHandle, Page } from 'playwright';
import { Helpers } from 'utils';

interface ParsedData {
  collectionAddress?: string;
  recipientAddress?: string;
  tokenId?: string;
  tokenURI?: string;
  name?: string;
  symbol?: string;
}

const selectors = {
  eventsList: '.list-group',
  eventListItem: '.list-group-item',
};
export default class EventsList {
  private readonly page: Page;
  private readonly helpers: Helpers;

  constructor(page: Page) {
    this.page = page;
    this.helpers = new Helpers(this.page);
  }

  async waitForNewEvent(): Promise<void> {
    const currentEventsListItems = await this.page.$$(selectors.eventListItem);
    await this.helpers.waitForFunction(async () => {
      const newEventsListItems = await this.page.$$(selectors.eventListItem);
      return newEventsListItems.length > currentEventsListItems.length;
    }, 20000);
  }

  async getLastEventElement(): Promise<ElementHandle | null> {
    const eventsList = await this.page.$(selectors.eventsList);
    const eventsListItems = await eventsList?.$$(selectors.eventListItem);
    return eventsListItems ? eventsListItems[eventsListItems.length - 1] : null;
  }

  async parseEventElement(eventElement: ElementHandle): Promise<ParsedData> {
    const eventText = await eventElement.innerText();
    console.log('eventText: ', eventText);

    const parsedData: ParsedData = {};

    if (eventText.includes('NFT minted')) {
      const collectionAddress = eventText.match(/collection: (.*?),/)?.[1];
      const recipientAddress = eventText.match(/to: (.*?),/)?.[1];
      const tokenId = eventText.match(/token id: (.*?) /)?.[1];
      const tokenURI = eventText.match(/token URI: (.*?)$/)?.[1];

      parsedData.collectionAddress = collectionAddress;
      parsedData.recipientAddress = recipientAddress;
      parsedData.tokenId = tokenId;
      parsedData.tokenURI = tokenURI;
    } else if (eventText.includes('Collection Created')) {
      const collectionAddress = eventText.match(/address: (.*?),/)?.[1];
      const name = eventText.match(/s*name:\s*(\w+)/)?.[1];
      const symbol = eventText.match(/symbol: (.*?)$/)?.[1];

      parsedData.collectionAddress = collectionAddress;
      parsedData.name = name;
      parsedData.symbol = symbol;
    }

    return parsedData;
  }
}

