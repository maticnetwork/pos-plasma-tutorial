pragma solidity 0.6.6;

import "./ERC20.sol";

contract myL2token is ERC20 {
    constructor(uint256 initialSupply) ERC20("myL2token", "ML2") public {
        _mint(msg.sender, initialSupply);
    }
}