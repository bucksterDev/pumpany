// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CompanyToken
 * @dev Simple ERC-20 token for AI-launched companies
 * Each company gets its own token that can be traded
 */
contract CompanyToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1 million tokens
    uint256 public constant FEE_PERCENTAGE = 1; // 1% fee on transfers
    address public feeCollector;

    event FeeCollected(address indexed from, address indexed to, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner,
        address _feeCollector
    ) ERC20(name, symbol) Ownable(initialOwner) {
        feeCollector = _feeCollector;
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /**
     * @dev Override transfer to include fee mechanism
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        uint256 fee = (amount * FEE_PERCENTAGE) / 100;
        uint256 amountAfterFee = amount - fee;

        _transfer(owner, to, amountAfterFee);

        if (fee > 0 && feeCollector != address(0)) {
            _transfer(owner, feeCollector, fee);
            emit FeeCollected(owner, to, fee);
        }

        return true;
    }

    /**
     * @dev Override transferFrom to include fee mechanism
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);

        uint256 fee = (amount * FEE_PERCENTAGE) / 100;
        uint256 amountAfterFee = amount - fee;

        _transfer(from, to, amountAfterFee);

        if (fee > 0 && feeCollector != address(0)) {
            _transfer(from, feeCollector, fee);
            emit FeeCollected(from, to, fee);
        }

        return true;
    }

    /**
     * @dev Update fee collector address
     */
    function setFeeCollector(address _feeCollector) external onlyOwner {
        feeCollector = _feeCollector;
    }
}
