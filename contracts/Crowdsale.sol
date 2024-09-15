// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
	address public owner;
	Token public token;
	uint256 public price;
	uint256 public maxTokens;
	uint256 public tokensSold;
	uint256 public openDate;
	uint256 public closeDate;

	mapping(address => bool) public whitelisted;

	event Buy(uint256 amount, address buyer);
	event Finalize(uint256 tokensSold, uint256 ethRaised);

	constructor(Token _token, uint256 _price, uint256 _maxTokens, uint256 _openDate, uint256 _closeDate) {
		owner = msg.sender;
		token = _token;
		price = _price;
		maxTokens = _maxTokens;
		openDate = _openDate;
		closeDate = _closeDate;
	}

	modifier onlyOwner() {
		require(msg.sender == owner, 'Caller is not the owner.');
		_;
	}

	modifier saleOpen() {
		require(block.timestamp >= openDate && block.timestamp <= closeDate, "Sale is not yet available");
		_;
	}

	modifier onlyWhitelisted() {
		require(whitelisted[msg.sender], "You are not whitelisted to buy tokens.");
		_;
	}

	receive() external payable {
		uint256 amount = msg.value / price;
		buyTokens(amount * 1e18);
	}

	function buyTokens(uint256 _amount) public payable saleOpen onlyWhitelisted {
        require(msg.value == (_amount / 1e18) * price);
		require(token.balanceOf(address(this)) >= _amount);
		require(token.transfer(msg.sender, _amount));
	
		tokensSold += _amount;

		emit Buy(_amount, msg.sender);
	}

	function setPrice(uint256 _price) public onlyOwner {
		price = _price;
	}

	function finalize() public onlyOwner {
		require(token.transfer(owner, token.balanceOf(address(this))));

		uint256 value = address(this).balance;
		(bool sent, ) = owner.call{value: value }("");
		require(sent);

		emit Finalize(tokensSold, value);
	}

	function addToWhitelist(address _address) public onlyOwner {
		whitelisted[_address] = true;
	}

	function setOpenDate(uint256 _openDate) public {
		require(msg.sender == owner, "Only the owner can set the open date");
		openDate = _openDate;
	}

	function setCloseDate(uint256 _closeDate) public {
		require(msg.sender == owner, "Only the owner can set the close date");
		closeDate = _closeDate;
	}

}
