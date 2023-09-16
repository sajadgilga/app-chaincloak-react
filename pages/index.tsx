'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';
import Web3 from 'web3';

export default function Chat(props: { apiKeyApp: string }) {
  const services: OpenAIModel[] = ["cohere", "openai"];
  // *** If you use .env.local variable for your API key, method which we recommend, use the apiKey variable commented below
  const { apiKeyApp } = props;
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  // Response message
  const [outputCodes, setOutputCodes] = useState<{message: string, isInput: boolean}[]>([]);
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>(services[0]);
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const handleTranslate = async (currentUrl: any) => {
    setInputOnSubmit(inputCode);

    // Chat post conditions(maximum number of characters, valid message etc.)
    const maxCodeLength = model === 'cohere' ? 700 : 700;

    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const body: ChatBody = {
      messages: [{content: inputCode, role: 'user'}],
    };
    setOutputCodes((prev) => [...prev, {message: inputCode, isInput: true}]);


    // -------------- Fetch --------------
    const response = await fetch(`${currentUrl}/${model}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      if (response) {
        alert(
          'Something went wrong went fetching from the API.',
        );
      }
      return;
    }

    const data = await response.json();

    if (!data) {
      setLoading(false);
      alert('Something went wrong');
      return;
    }

    setOutputCodes((prev) => [...prev, {message: data.data, isInput: false}]);

    setLoading(false);
  };

  const [account, setAccount] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const[currentUrl, setCurrentUrl] = useState("")
  const [error, setError] = useState("");
  const { ethereum }: any = typeof window !== "undefined" ? window : {};
  const checkEthereumExists = () => {
    if (!ethereum) {
      setError("Please Install MetaMask.");
      return false;
    }
    return true;
  };

  const getConnectedAccounts = async () => {
    setError("");
    try {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      console.log('unknown',accounts);
      setAccount(accounts[0]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      getConnectedAccounts();
    }
    return () => {
      if (checkEthereumExists()) {
        ethereum.removeListener("accountsChanged", getConnectedAccounts);
      }
    };
  }, []);

  useEffect(() => {
    // Update the publicKey when the account changes
    setPublicKey(account || "");
  }, [account]);

  const handleConnect = async () => {
    setError("");
    if (checkEthereumExists()) {
      try {
        if (account) {
          setAccount("");
        } else {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log('connected accounts',accounts);
          setAccount(accounts[0]);
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  }

  const web3 = new Web3('https://sepolia.infura.io/v3/6470eff63ad7429e88bab4a2e92a16ea');
  const abi = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "initialUrls",
          "type": "string[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "appendedUrl",
          "type": "string"
        }
      ],
      "name": "UrlAppended",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "url",
          "type": "string"
        }
      ],
      "name": "UrlEmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "url",
          "type": "string"
        }
      ],
      "name": "UrlListEmitted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newUrl",
          "type": "string"
        }
      ],
      "name": "appendUrl",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "emitAllUrls",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "emitNextNode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "urls",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const contractAddress = '0xaa39fbCBd0899c9445770361051Db602C55AABA8'; 


  const contract = new web3.eth.Contract(abi, contractAddress);

  async function emitNextNode() {
    const web3 = new Web3((window as any).ethereum);
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
      console.log('temp',account)
        const gas = await contract.methods.emitNextNode().estimateGas({ from: account });
        const txReceipt = await contract.methods.emitNextNode().send({ from: account, gas: gas as any });
        console.log(`Transaction hash: ${txReceipt.transactionHash}`);
    } catch (error) {
        console.error(error);
    }
}


  const readData = async () => {
    const eventName = 'UrlListEmitted'; // Replace with your event name
    const filterOptions = {}; // You can add additional filters here if needed

    contract.getPastEvents(eventName as any, {
      filter: filterOptions,
      fromBlock: 0,
      toBlock: 'latest',
    })
      .then(events => {
        if (events.length > 0) {
          const latestEvent = events[events.length - 1];
          console.log('Latest Event:', (latestEvent as any).returnValues); // Access event data
          console.log((latestEvent as any).returnValues.url)
          setCurrentUrl((latestEvent as any).returnValues.url);
        } else {
          console.log('No events found');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    if (!account) {
      return;
    }
    readData()
      .then(() => {
        return emitNextNode();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, [account]);


  // -------------- Copy Response --------------
  // const copyToClipboard = (text: string) => {
  //   const el = document.createElement('textarea');
  //   el.value = text;
  //   document.body.appendChild(el);
  //   el.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(el);
  // };

  // *** Initializing apiKey with .env.local value
  // useEffect(() => {
  // ENV file verison
  // const apiKeyENV = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  // if (apiKey === undefined || null) {
  //   setApiKey(apiKeyENV)
  // }
  // }, [])

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '0px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
        minHeight="100vh"
        pb={{ base: '60px'}}
      >
        {/* Model Change */}
        <Flex direction={'column'} w="100%" mb={outputCodes.length > 0 ? '20px' : 'auto'}>
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="20px"
            borderRadius="60px"
          >
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'cohere' ? buttonBg : 'transparent'}
              w="174px"
              h="70px"
              boxShadow={model === 'cohere' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('cohere')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              Cohere
            </Flex>
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'openai' ? buttonBg : 'transparent'}
              w="164px"
              h="70px"
              boxShadow={model === 'openai' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('openai')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdBolt}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              OpenAI
            </Flex>
            <Flex
            justifySelf={'flex-end'}
            px="100px"
            >
            <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="35px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg:
                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleConnect}
            isLoading={loading ? true : false}
          >
            {account
              ? `Disconnect Wallet (${publicKey.slice(0, 5)})`
              : "Connect Wallet"}
          </Button>
            </Flex>
          </Flex>

        </Flex>
        {/* Main Box */}        
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={outputCodes.length > 0 ? 'flex' : 'none'}
          mb={'auto'}
        >
          {outputCodes.map((outputCode) => 
          outputCode.isInput ?
            <Flex w="100%" align={'center'} mb="10px">
             
              <Flex
                p="22px"
                border="1px solid"
                borderColor={borderColor}
                borderRadius="14px"
                w="100%"
                zIndex={'2'}
              >
                <Text
                  color={textColor}
                  fontWeight="600"
                  fontSize={{ base: 'sm', md: 'md' }}
                  lineHeight={{ base: '24px', md: '26px' }}
                >
                  {outputCode.message}
                </Text>
              </Flex>

              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={'transparent'}
                border="1px solid"
                borderColor={borderColor}
                ms="20px"
                h="40px"
                minH="40px"
                minW="40px"
              >
                <Icon
                  as={MdPerson}
                  width="20px"
                  height="20px"
                  color={brandColor}
                />
              </Flex>
            </Flex>
            :
            <Flex w="100%" mb="10px">
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
                me="20px"
                h="40px"
                minH="40px"
                minW="40px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color="white"
                />
              </Flex>
              <MessageBoxChat output={outputCode.message} />
            </Flex>
          )}
        </Flex>

        {/* Chat Input */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            onChange={handleChange}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg:
                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={ () => {
              handleTranslate(currentUrl);
            }}
            isLoading={loading ? true : false}
          >
            Submit
          </Button>
        </Flex>

        <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            Free Research Preview. This LLM may produce inaccurate information
            about people, places, or facts.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
