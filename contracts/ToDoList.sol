// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToDoList {
    struct Task {
        string content;
        bool completed;
    }

    mapping(address => Task[]) public userTasks;

    function addTask(string memory _content) public {
        userTasks[msg.sender].push(Task(_content, false));
    }

    function completeTask(uint index) public {
        require(index < userTasks[msg.sender].length, "Invalid index");
        userTasks[msg.sender][index].completed = true;
    }

    //  This is the FIXED version
    function getTasks() public view returns (string[] memory contents, bool[] memory completed) {
        uint length = userTasks[msg.sender].length;
        contents = new string[](length);
        completed = new bool[](length);
        
        for (uint i = 0; i < length; i++) {
            contents[i] = userTasks[msg.sender][i].content;
            completed[i] = userTasks[msg.sender][i].completed;
        }

        return (contents, completed);
    }
}


