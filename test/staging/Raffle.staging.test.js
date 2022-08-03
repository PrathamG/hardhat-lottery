const { WebSocketProvider } = require("@ethersproject/providers");
const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", function () {
      let deployer, raffle, entranceFee;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract("Lottery", deployer);
        entranceFee = await raffle.getEntranceFee();
      });

      describe("fulfillRandomWords", async function () {
        it("works with live Chainlink Keepers and Chainlink VRF, we get a reandom winner", async function () {
          const startingTimestamp = await raffle.getLatestTimestamp();
          const accounts = await ethers.getSigners();

          await new Promise(async function (resolve, reject) {
            raffle.once("WinnerPicked", async function () {
              console.log("Winner Picked!");
              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerBalance = await accounts[0].getBalance();
                const endingTimestamp = await raffle.getLatestTimestamp();
                const numPlayers = await raffle.getNumberOfPlayers();

                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(numPlayers.toString(), "0");
                assert.equal(raffleState.toString(), "0");
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(entranceFee).toString()
                );
                assert(endingTimestamp > startingTimestamp);
                resolve();
              } catch (error) {
                console.log(error);
                reject(e);
              }
            });

            await raffle.enterRaffle({ value: entranceFee });
            const winnerStartingBalance = await accounts[0].getBalance();
          });
        });
      });
    });
