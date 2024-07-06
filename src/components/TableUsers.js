import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import _, { debounce } from "lodash";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

import { fecthAllUser } from "../services/UserService";
import ModalAddNew from "./ModalAddNew";
import ModalEditUser from "./ModalEditUser";
import ModalComfirm from "./ModalComfirm";

const TableUsers = (props) => {
    const [listUsers, setListUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [dataUserEdit, setDataUserEdit] = useState({});

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState({});

    const [sortBy, setSortBy] = useState("asc");
    const [sortFieldId, setSortFieldId] = useState("id");
    const [dataExport, setDataExport] = useState([]);

    const handleClose = () => {
        setIsShowModalAddNew(false);
        setIsShowModalEdit(false);
        setIsShowModalDelete(false);
    };

    const handleUpdateTable = (user) => {
        setListUsers([user, ...listUsers]);
    };

    const handleSetEditUser = (user) => {
        setIsShowModalEdit(true);
        setDataUserEdit(user);
    };

    const handleUpdateFromUser = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers);
        let index = listUsers.findIndex((item) => item.id === user.id);
        cloneListUsers[index].first_name = user.first_name;
        setListUsers(cloneListUsers);
    };

    const handleDeleteFromUser = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers = cloneListUsers.filter((item) => item.id !== user.id);
        console.log(cloneListUsers);
        setListUsers(cloneListUsers);
    };

    useEffect(() => {
        //call APIs
        getAllUsers(1);
    }, []);

    const getAllUsers = async (page) => {
        let res = await fecthAllUser(page);
        if (res && res.data) {
            setListUsers(res.data);
            setTotalUsers(res.total);
            setTotalPages(res.total_pages);
        }
    };

    const handlePageClick = (e) => {
        getAllUsers(+e.selected + 1);
    };

    const handleDeleteUser = (user) => {
        setIsShowModalDelete(true);
        setDataUserDelete(user);
    };

    const handleSortBy = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortFieldId(sortField);
        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
        setListUsers(cloneListUsers);
    };

    const handleSearch = debounce((e) => {
        let term = e.target.value;
        if (term) {
            let cloneListUsers = _.cloneDeep(listUsers);
            cloneListUsers = cloneListUsers.filter((item) =>
                item.email.includes(term)
            );
            setListUsers(cloneListUsers);
        } else {
            getAllUsers(1);
        }
    }, 100);

    const handleExport = (e, done) => {
        let result = [];
        if (listUsers && listUsers.length > 0) {
            result.push(["ID", "Email", "First Name", "Last Name"]);
            listUsers.map((user, index) => {
                let arr = [];
                arr[0] = user.id;
                arr[1] = user.email;
                arr[2] = user.first_name;
                arr[3] = user.last_name;
                result.push(arr);
            });
            setDataExport(result);
            done();
        }
    };

    const handleImport = (e) => {
        if (e.target && e.target.files[0] && e.target.files) {
            let file = e.target.files[0];
            if (file.type !== "text/csv") {
                toast.error("Only accept .CSV files");
                return;
            }
            Papa.parse(file, {
                // header: true,
                complete: function (results) {
                    let rawCSV = results.data;
                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 3) {
                            if (
                                rawCSV[0][0] !== "email" ||
                                rawCSV[0][1] !== "first_name" ||
                                rawCSV[0][2] !== "last_name"
                            ) {
                                toast.error("Wrong format header CSV file!");
                            } else {
                                let result = [];
                                rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 3) {
                                        let obj = {};
                                        obj.id = index;
                                        obj.email = item[0];
                                        obj.first_name = item[1];
                                        obj.last_name = item[2];
                                        result.push(obj);
                                    }
                                });
                                setListUsers(result);
                            }
                        }
                    }
                },
            });
        }
    };
    return (
        <>
            <div className="my-3 add-new d-sm-flex">
                <span className="col-12 col-sm-4">List users:</span>
                <div className="group-btn mt-sm-0 mt-2">
                    <Button className="btn btn-warning">
                        <i className="fa-solid fa-file-import"></i>
                        <label htmlFor="inputFile">Import</label>
                        <input
                            type="file"
                            id="inputFile"
                            onChange={(e) => handleImport(e)}
                        />
                    </Button>
                    <CSVLink
                        data={dataExport}
                        filename={"my-file.csv"}
                        className="btn btn-success"
                        asyncOnClick={true}
                        onClick={handleExport}
                    >
                        <i className="fa-solid fa-download"></i>
                        Download
                    </CSVLink>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setIsShowModalAddNew(true);
                        }}
                    >
                        <i className="fa-solid fa-circle-plus"></i>
                        Add new user
                    </Button>{" "}
                </div>
            </div>
            <div className="col-12 col-sm-4 my-3">
                <input
                    className="form-control"
                    placeholder="Search here..."
                    onChange={(e) => handleSearch(e)}
                />
            </div>
            <div className="customizeTable">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <div className="sortTable-header">
                                    <span>ID</span>
                                    <span>
                                        <i
                                            className="fa-solid fa-arrow-up-long"
                                            onClick={() =>
                                                handleSortBy("desc", "id")
                                            }
                                        ></i>
                                        <i
                                            className="fa-solid fa-arrow-down-long"
                                            onClick={() =>
                                                handleSortBy("asc", "id")
                                            }
                                        ></i>
                                    </span>
                                </div>
                            </th>
                            <th>Email</th>
                            <th>
                                <div className="sortTable-header">
                                    <span>First name</span>
                                    <span>
                                        <i
                                            className="fa-solid fa-arrow-up-long"
                                            onClick={() =>
                                                handleSortBy(
                                                    "desc",
                                                    "first_name"
                                                )
                                            }
                                        ></i>
                                        <i
                                            className="fa-solid fa-arrow-down-long"
                                            onClick={() =>
                                                handleSortBy(
                                                    "asc",
                                                    "first_name"
                                                )
                                            }
                                        ></i>
                                    </span>
                                </div>
                            </th>
                            <th>Last Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUsers &&
                            listUsers.length > 0 &&
                            listUsers.map((user, index) => (
                                <tr key={`user-${index}`}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning mx-3"
                                            onClick={() => {
                                                handleSetEditUser(user);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                handleDeleteUser(user)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </div>
            <div className="d-sm-flex justify-content-center">
            <ReactPaginate
                className=""
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
            />
            </div>
            <ModalAddNew
                show={isShowModalAddNew}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
            />
            <ModalEditUser
                show={isShowModalEdit}
                handleClose={handleClose}
                dataUserEdit={dataUserEdit}
                handleUpdateFromUser={handleUpdateFromUser}
            />
            <ModalComfirm
                show={isShowModalDelete}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleDeleteFromUser={handleDeleteFromUser}
            />
        </>
    );
};

export default TableUsers;
