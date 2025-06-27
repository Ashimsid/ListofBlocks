import { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_content",
        "type": "string"
      }
    ],
    "name": "addTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "completeTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTasks",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "contents",
        "type": "string[]"
      },
      {
        "internalType": "bool[]",
        "name": "completed",
        "type": "bool[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);


  async function connectWallet() {
    if (window.ethereum) {
      const [selectedAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(selectedAccount);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const todoContract = new ethers.Contract(contractAddress, contractABI, signer);

      setContract(todoContract);
    } else {
      alert("🦊 MetaMask not detected. Please install MetaMask.");
    }
  }

  async function loadTasks() {
    if (contract) {
      try {
        const [contents, completed] = await contract.getTasks();
        const formattedTasks = contents.map((text, i) => ({
          content: text,
          completed: completed[i]
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    }
  }

  async function addTask() {
    if (contract && newTask) {
      try {
        const tx = await contract.addTask(newTask);
        await tx.wait();
        setNewTask("");
        loadTasks();
      } catch (err) {
        console.error("Add task error:", err);
      }
    }
  }

  async function completeTask(index) {
    if (contract) {
      try {
        const tx = await contract.completeTask(index);
        await tx.wait();
        loadTasks();
      } catch (err) {
        console.error("Complete task error:", err);
      }
    }
  }

  useEffect(() => {
    if (contract) loadTasks();
  }, [contract]);

  return (
    <div className="App p-4 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">📝 My ToDoList DApp</h1>

      {!account && (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect MetaMask
        </button>
      )}

      {account && (
        <div className="mt-4">
          <div className="flex mb-2">
            <input
              className="flex-1 border p-2 rounded"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task"
            />
            <button
              onClick={addTask}
              className="bg-green-500 text-white px-4 ml-2 rounded"
            >
              Add
            </button>
          </div>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <span className={task.completed ? "line-through" : ""}>
                  {task.content}
                </span>
                {!task.completed && (
                  <button
                    onClick={() => completeTask(index)}
                    className="bg-yellow-500 text-white px-2 rounded"
                  >
                    Complete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;


      
