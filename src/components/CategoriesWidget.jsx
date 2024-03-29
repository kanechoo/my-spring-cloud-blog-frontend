import React, {useEffect, useState} from "react";
import {Divider, Icon, Loader} from "semantic-ui-react";
import API from "../data/DataUrl";

export default function CategoriesWidget() {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    useEffect(() => {
        const axois = require("axios").default;
        axois
            .get(API.GET_CATEGORIES_URL)
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                console.log("error" + error.response.data);
            });
        setShow(true);
    }, []);
    return (
        <>
            <div className="widget-container">
        <span className="title">
          <Icon name="bookmark" style={{color: "#169E36"}}/>
          Categories
        </span>
                <Divider/>
                <div>
                    {data && data.length > 0 ? (
                        data.map((e, index) => (
                            <a
                                key={index}
                                href={"/category/" + e.categoryName}
                                className="widget-label"
                            >
                                {e.categoryName}
                                &nbsp;
                                {e.count}
                            </a>
                        ))
                    ) : (
                        <Loader style={{marginTop: "1em"}} active inline="centered"/>
                    )}
                </div>
            </div>
        </>
    );
}
