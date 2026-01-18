// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OnChainScholarship {

    /*//////////////////////////////////////////////////////////////
                                STATE
    //////////////////////////////////////////////////////////////*/

    address public admin;
    uint256 public scholarshipCount;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    enum ApplicationStatus {
        Pending,
        Approved,
        Rejected,
        Claimed
    }

    struct Scholarship {
        uint256 id;
        string title;
        string description;
        uint256 amount;
        bool isActive;
    }

    struct Application {
        address applicant;
        string metadataURI; // IPFS / Arweave
        ApplicationStatus status;
    }

    // scholarshipId => Scholarship
    mapping(uint256 => Scholarship) public scholarships;

    // scholarshipId => applicant => Application
    mapping(uint256 => mapping(address => Application)) public applications;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event ScholarshipCreated(
        uint256 indexed scholarshipId,
        string title,
        uint256 amount
    );

    event ApplicationSubmitted(
        uint256 indexed scholarshipId,
        address indexed applicant,
        string metadataURI
    );

    event ApplicationApproved(
        uint256 indexed scholarshipId,
        address indexed applicant
    );

    event ApplicationRejected(
        uint256 indexed scholarshipId,
        address indexed applicant
    );

    event FundsClaimed(
        uint256 indexed scholarshipId,
        address indexed applicant,
        uint256 amount
    );

    /*//////////////////////////////////////////////////////////////
                            ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function createScholarship(
        string calldata _title,
        string calldata _description
    ) external payable onlyAdmin {
        require(msg.value > 0, "Funding required");

        scholarships[scholarshipCount] = Scholarship({
            id: scholarshipCount,
            title: _title,
            description: _description,
            amount: msg.value,
            isActive: true
        });

        emit ScholarshipCreated(
            scholarshipCount,
            _title,
            msg.value
        );

        scholarshipCount++;
    }

    function approveApplication(
        uint256 _scholarshipId,
        address _applicant
    ) external onlyAdmin {
        Application storage app =
            applications[_scholarshipId][_applicant];

        require(app.applicant != address(0), "No application");
        require(app.status == ApplicationStatus.Pending, "Invalid state");

        app.status = ApplicationStatus.Approved;

        emit ApplicationApproved(_scholarshipId, _applicant);
    }

    function rejectApplication(
        uint256 _scholarshipId,
        address _applicant
    ) external onlyAdmin {
        Application storage app =
            applications[_scholarshipId][_applicant];

        require(app.applicant != address(0), "No application");
        require(app.status == ApplicationStatus.Pending, "Invalid state");

        app.status = ApplicationStatus.Rejected;

        emit ApplicationRejected(_scholarshipId, _applicant);
    }

    function closeScholarship(uint256 _scholarshipId)
        external
        onlyAdmin
    {
        scholarships[_scholarshipId].isActive = false;
    }

    /*//////////////////////////////////////////////////////////////
                        APPLICANT FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function submitApplication(
        uint256 _scholarshipId,
        string calldata _metadataURI
    ) external {
        Scholarship memory scholarship =
            scholarships[_scholarshipId];

        require(scholarship.isActive, "Scholarship closed");
        require(bytes(_metadataURI).length > 0, "Metadata required");

        Application storage existing =
            applications[_scholarshipId][msg.sender];

        require(existing.applicant == address(0), "Already applied");

        applications[_scholarshipId][msg.sender] = Application({
            applicant: msg.sender,
            metadataURI: _metadataURI,
            status: ApplicationStatus.Pending
        });

        emit ApplicationSubmitted(
            _scholarshipId,
            msg.sender,
            _metadataURI
        );
    }

    function claimFunds(uint256 _scholarshipId) external {
        Scholarship storage scholarship =
            scholarships[_scholarshipId];

        Application storage app =
            applications[_scholarshipId][msg.sender];

        require(app.status == ApplicationStatus.Approved, "Not approved");
        require(scholarship.amount > 0, "Funds already claimed");

        uint256 payout = scholarship.amount;

        // Effects
        scholarship.amount = 0;
        app.status = ApplicationStatus.Claimed;

        // Interaction (safe & future-proof)
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "ETH transfer failed");

        emit FundsClaimed(
            _scholarshipId,
            msg.sender,
            payout
        );
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getApplicationStatus(
        uint256 _scholarshipId,
        address _applicant
    ) external view returns (ApplicationStatus) {
        return applications[_scholarshipId][_applicant].status;
    }

    function getScholarship(
        uint256 _scholarshipId
    ) external view returns (Scholarship memory) {
        return scholarships[_scholarshipId];
    }
}
