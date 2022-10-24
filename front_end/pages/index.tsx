import type { NextPage } from 'next'
import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Counter__factory } from '../generated/contract-types'
import {
  Navbar,
  Footer,
  Card,
  Label,
  TextInput,
  Button,
  Alert,
} from 'flowbite-react'
declare let window: any

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>()
  const [balance, setBalance] = useState<string>()
  const [count, setCount] = useState<number>(0)
  const [number, setNumber] = useState<number>(0)
  const [time, setTime] = useState(Date.now())
  const COUNTER_ADDRESS = '0x4B54941BB18D54dD78D9bA598bc799a759c671c9'

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const provider = new ethers.providers.InfuraProvider('goerli')
    const counter = Counter__factory.connect(COUNTER_ADDRESS, provider)
    if (counter) {
      counter.number().then((count) => {
        setCount(count.toNumber())
      })
    }
  }, [time])

  const handleConnectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    setAddress(await signer.getAddress())
    setBalance(ethers.utils.formatEther(await signer.getBalance()))
  }

  const handleRefresh = async () => {
    const provider = new ethers.providers.InfuraProvider('goerli')
    const counter = Counter__factory.connect(COUNTER_ADDRESS, provider)
    const n = await counter.number()
    setCount(n.toNumber())
  }

  const handleIncrement = async () => {
    console.log('increment')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = await provider.getSigner()
    const counter = Counter__factory.connect(COUNTER_ADDRESS, signer)
    await counter.increment()
  }

  const handleSetNumber = async () => {
    console.log('set number')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = Counter__factory.connect(COUNTER_ADDRESS, signer)
    await contract.setNumber(number)
  }

  return (
    <div className="">
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="/">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            DApp Demo
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {address ? (
            <>
              <div>{address}</div>
              <div>{balance}</div>
            </>
          ) : (
            <Button onClick={handleConnectWallet}>Connect Wallet</Button>
          )}
        </Navbar.Collapse>
      </Navbar>

      <Alert
        color="warning"
        additionalContent={
          <>
            <a
              href={`https://goerli.etherscan.io/address/${COUNTER_ADDRESS}`}
              className="mr-2 inline-flex items-center rounded-lg bg-yellow-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 dark:bg-yellow-800 dark:hover:bg-yellow-900"
            >
              View more
            </a>
          </>
        }
      >
        <div className="flex w-full justify-between flex-row space-x-5">
          <div>
            <span className="font-medium">Alert!</span> This smart contract runs
            on the Goerli testnet.
          </div>
        </div>
      </Alert>

      <div className="min-w-screen min-h-full mx-auto mt-8">
        <div className="container flex flex-col justify-center items-center space-y-5">
          <div className="text-3xl font-bold">Counter {count}</div>
          <Button color="light" onClick={handleRefresh}>
            Refresh Counter
          </Button>

          <Card>
            <Button onClick={handleIncrement}>Increment Counter</Button>
          </Card>

          <Card>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="number" value="Set Number" />
              </div>
              <TextInput
                id="number"
                type="number"
                placeholder="Enter number"
                value={number}
                required={true}
                onChange={(e) => setNumber(parseInt(e.target.value))}
              />
            </div>

            <Button type="submit" onClick={handleSetNumber}>
              Submit
            </Button>
          </Card>
        </div>
      </div>
      <Footer container={true}>
        <Footer.Copyright
          href="#"
          by="OhMyApps™"
          year={new Date().getFullYear()}
        />
        <Footer.LinkGroup>
          <Footer.Link href="#">About</Footer.Link>
          <Footer.Link href="#">Privacy Policy</Footer.Link>
          <Footer.Link href="#">Licensing</Footer.Link>
          <Footer.Link href="#">Contact</Footer.Link>
        </Footer.LinkGroup>
      </Footer>
    </div>
  )
}

export default Home
