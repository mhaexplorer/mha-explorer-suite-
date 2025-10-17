
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MahToken {
    // ---------------------------
    // Token metadata
    string public name = "MahToken";
    string public symbol = "MHA";
    uint8 public decimals = 18;

    // ---------------------------
    // Supply
    uint256 private _totalSupply;

    // ---------------------------
    // Balances & allowances
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // ---------------------------
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // ---------------------------
    // Constructor: Immutable supply
    constructor() {
        _totalSupply = 1_000_000 * 10 ** decimals; // 1,000,000 MHA
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    // ---------------------------
    // ERC-20 standard functions
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        unchecked {
            balanceOf[msg.sender] -= amount;
            balanceOf[to] += amount;
        }
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");
        unchecked {
            balanceOf[from] -= amount;
            balanceOf[to] += amount;
            allowance[from][msg.sender] -= amount;
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        uint256 newAllowance = allowance[msg.sender][spender] + addedValue;
        require(newAllowance >= allowance[msg.sender][spender], "Overflow error");
        allowance[msg.sender][spender] = newAllowance;
        emit Approval(msg.sender, spender, newAllowance);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        uint256 currentAllowance = allowance[msg.sender][spender];
        require(currentAllowance >= subtractedValue, "Subtraction overflow");
        unchecked {
            allowance[msg.sender][spender] = currentAllowance - subtractedValue;
        }
        emit Approval(msg.sender, spender, allowance[msg.sender][spender]);
        return true;
    }
}
