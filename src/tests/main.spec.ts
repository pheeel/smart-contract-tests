import test, { expect } from 'fixtures';

const deployCollectionTestData = {
  collectionName: 'TestCollection',
  collectionSymbol: 'TST',
  tokenUri: 'collection_uri',
};
const testWalletAddress = '0x7E87B06eca3B24DEA74fE87e7F2715aE395dF615';
const mintNftTestData = {
  collectionAddress: '',
  recipientAddress: testWalletAddress,
  tokenId: '1',
};

test.describe.serial('App', () => {
  test('Deploy Collection', async ({ metamask, deployCollectionForm, eventsList }) => {
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

  test('Mint NFT', async ({ metamask, mintNftForm, eventsList }) => {
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
      collectionAddress: mintNftTestData.collectionAddress,
      recipientAddress: mintNftTestData.recipientAddress,
      tokenId: mintNftTestData.tokenId,
      tokenURI: `collection_uri${mintNftTestData.tokenId}`,
    });
  });
});
