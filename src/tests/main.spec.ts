import test, { expect } from 'fixtures';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as metamask from '@synthetixio/synpress/commands/metamask';

const deployCollectionTestData = {
  collectionName: 'TestCollection',
  collectionSymbol: 'TST',
  tokenUri: 'collection_uri',
};
const testWalletAddress = '0x7E87B06eca3B24DEA74fE87e7F2715aE395dF615';
const mintNftTestData = {
  collectionAddress: '',
  recipientAddress: testWalletAddress,
  tokenId: 1,
};
const baseURL = 'http://localhost:3000';

test.describe.serial('App', () => {
  test('Deploy Collection', async ({ context, deployCollectionForm, eventsList }) => {
    // await page.goto(baseURL);
    // await page.reload();
    await context.pages()[context.pages().length - 1].goto(baseURL);
    await metamask.acceptAccess();
    await deployCollectionForm.fillTheForm(
      deployCollectionTestData.collectionName,
      deployCollectionTestData.collectionSymbol,
      deployCollectionTestData.tokenUri,
    );
    await deployCollectionForm.clickCreateButton();
    await metamask.confirmTransaction();
    await eventsList.waitForNewEvent();

    const lastEventElement = await eventsList.getLastEventElement();
    const parsedDeployedCollectionData = await eventsList.parseEventElement(lastEventElement!);
    mintNftTestData.collectionAddress = parsedDeployedCollectionData.collectionAddress!;

    await expect(parsedDeployedCollectionData).toEqual({
      collectionAddress: await expect.any(String),
      name: deployCollectionTestData.collectionName,
      symbol: deployCollectionTestData.collectionSymbol,
    });
  });

  test('Mint NFT', async ({ page, context, mintNftForm, eventsList }) => {
    await page.goto(baseURL);
    // await page.reload();
    console.info('context.pages().length: ', context.pages().length);
    await context.pages()[context.pages().length - 1].goto(baseURL);
    await metamask.acceptAccess();
    await mintNftForm.fillTheForm(
      mintNftTestData.collectionAddress,
      mintNftTestData.recipientAddress,
      mintNftTestData.tokenId,
    );
    await mintNftForm.clickMintButton();
    await metamask.confirmTransaction();
    await eventsList.waitForNewEvent();

    const lastEventElement = await eventsList.getLastEventElement();
    const parsedEventData = await eventsList.parseEventElement(lastEventElement!);

    await expect(parsedEventData).toEqual({
      collectionAddress: await expect.any(String),
      name: deployCollectionTestData.collectionName,
      symbol: deployCollectionTestData.collectionSymbol,
    });
  });
});
