import React, { useState, useEffect } from 'react'

import { generateIcon, copyIcon } from './assets'

type Options = {
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
}

const App: React.FC = () => {
  const availablePool: string[] = [
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "0123456789",
    "!@#$%&?+-*"
  ]

  const [password, setPassword] = useState<string>("")
  const [passwordLength, setPasswordLength] = useState<number>(12)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [copyString, setCopyString] = useState("")

  const [options, setOptions] = useState<Options>({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false
  })

  const handleGeneratePassword = () => {
    const { lowercase, uppercase, numbers, symbols } = options
    if (!(lowercase || uppercase || numbers || symbols)) return

    let generatedPool: string[] = []
    if (lowercase) generatedPool.push(availablePool[0])
    if (uppercase) generatedPool.push(availablePool[1])
    if (numbers) generatedPool.push(availablePool[2])
    if (symbols) generatedPool.push(availablePool[3])

    let passwordString = ""
    for (let i = 0; i < passwordLength; i++) {
      let selectedPool = generatedPool[Math.floor(Math.random() * generatedPool.length)]
      passwordString += selectedPool.charAt(Math.floor(Math.random() * selectedPool.length))
    }
    setPassword(passwordString)
  }

  const handleSelection = (option: keyof Options) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option]
    }))
  }

  const handleCopy = async () => {
    if (isCopied) return
    try {
      const clipboard = await navigator.clipboard.readText()
      if (password === clipboard) setCopyString("Already copied!")
      else {
        await navigator.clipboard.writeText(password)
        setCopyString("Copied!")
      }
    } catch (error) {
      await navigator.clipboard.writeText(password)
      setCopyString("Copied!")
    }

    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  useEffect(() => {
    if (passwordLength > 256) setPasswordLength(256)
    if (passwordLength < 1) setPasswordLength(1)
  }, [passwordLength])

  useEffect(() => {
    handleGeneratePassword()
  }, [])

  return (
    <div className='bg-[#2C3137] text-[#FFFEFE] fira-600 w-full min-h-screen overflow-hidden flex flex-col justify-center items-center whitespace-nowrap'>
      <h2 className={`${!isCopied ? "max-w-[80%] md:max-w-[70%] xl:max-w-[60%] overflow-x-scroll overflow-y-hidden mb-6" : "mb-[40px]"} text-6xl`}>{!isCopied ? password : copyString}</h2>
      <div>
        <section className='flex flex-row items-center gap-2 mb-4'>
          <span onClick={handleGeneratePassword}><img src={generateIcon} className='w-8 h-8 cursor-pointer' /></span>
          <span onClick={handleCopy}><img src={copyIcon} className='w-8 h-8 cursor-pointer' /></span>
          <span className='ml-2 text-4xl'>Length: <input type='number' value={passwordLength} min={1} max={256} onChange={(e) => setPasswordLength(Number(e.target.value))} className='bg-[#888C90] text-[#075FE3] text-center font-bold' /></span>
        </section>
        <section className='grid grid-cols-2 gap-6'>
          {Object.keys(options).map((option, index) => (
            <span key={index} onClick={() => handleSelection(option as keyof typeof options)} className='flex flex-row justify-center'><p className={`${!(options[option as keyof typeof options]) ? "text-[#888C90] hover:text-white" : "text-[#075FE3] hover:text-[#888C90]"} text-3xl font-bold cursor-pointer mx-auto`}>{`${option.charAt(0).toUpperCase() + option.slice(1)}`}</p></span>
          ))}
        </section>
      </div>
    </div>
  )
}

export default App