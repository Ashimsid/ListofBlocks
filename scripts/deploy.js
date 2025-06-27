const hre = require("hardhat");

async function main() {
  const ToDoList = await hre.ethers.getContractFactory("ToDoList");
  const toDoList = await ToDoList.deploy();
  await toDoList.waitForDeployment();

  console.log("ToDoList deployed to:", toDoList.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
