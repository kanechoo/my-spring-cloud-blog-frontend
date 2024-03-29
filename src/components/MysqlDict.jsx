import React, {useEffect, useState} from "react";
import {Button, Container, Header, Input, Label} from "semantic-ui-react";
import {Select as SelectTo} from "semantic-ui-react";
import Spacing from "./Spacing";
import RequestBuilder from "../util/RequestBuilder";
import makeAnimated from 'react-select/animated';
import API from "../data/DataUrl";
import Select from "react-select";

async function getTableName(databaseName) {
    const axios = require("axios").default;
    const url = new RequestBuilder()
        .setUrl(API.GET_TABLE_NAME+databaseName)
        .build()
        .toUrlString();
    return axios.get(url).then((res) => res.data);
}

async function postThenDownload(database,fileName, selectedTable) {
    const axios = require("axios").default
    return await axios.post(API.DOWNLOAD_MYSQL_DICT+database, {
        "fileName": fileName, "tables": selectedTable, "website": window.location.hostname
    }, {
        headers: {
            "Content-Type": "application/json"
        },
        responseType: "blob"
    })
}

export default function MySqlDict() {
    const options = [
        {value: 'chocolate', label: 'Chocolate'},
        {value: 'strawberry', label: 'Strawberry'},
        {value: 'vanilla', label: 'Vanilla'}
    ]
    const setSelectedOptions2 = (options) => {
        if (options.length > 0) {
            setActiveSubmit(true)
        } else {
            setActiveSubmit(false)
        }
        setSelectedOptions(options)
    }
    let [selectedOptions, setSelectedOptions] = useState(null);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [fileName, setFileName] = useState("");
    const [activeSubmit, setActiveSubmit] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [database,setDatabase]=useState("");
    const [loading,setLoading]=useState(false);
    const handlerFileName = (e) => {
        setFileName(e.target.value)
    }
    useEffect(() => {
        
    }, [])
    const handleSelectDatabase=(e,data)=>{
        setDefaultOptions([]);
        setLoading(true);
        setDatabase(data.value);
        getTableName(data.value).then(data => {
            setDefaultOptions(data)
            setLoading(false);
        })
    }
    const submitHandler = () => {
        setSubmitLoading(true);
        postThenDownload(database,fileName, selectedOptions)
            .then(response => {
                const name = response.headers["content-disposition"].split("filename=")[1];
                const url = window.URL.createObjectURL(new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName + ".docx"); //or any other extension
                document.body.appendChild(link);
                link.click();
                setSubmitLoading(false);
            }).catch(e => {
            setSubmitLoading(false);
        })
    }
    const countryOptions = [
        { key: 'ehc-saas', value: 'ehc-saas', text: 'SAAS' },
        { key: 'storefront', value: 'storefront', text: 'STOREFRONT' }
      ]
    return (<>
        <Container textAlign="justified">
            <Spacing/>
            <Header style={{fontFamily: 'charter'}} as={"h2"}>MYSQL TABLE DICTIONARY GENERATOR V1.0</Header>
            <Spacing/>
            <div style={{width: '618px', display: 'inline-block'}}>
            <SelectTo placeholder='Select database' options={countryOptions} onChange={handleSelectDatabase}/>
            </div>
            <Spacing/>
            <div style={{width: '618px', display: 'inline-block'}}>
                <div style={{textAlign: 'left'}}>
                    <AnimatedMulti defaultOptions={defaultOptions} selectedOptions={selectedOptions}
                                   selectedOptionsHandler={setSelectedOptions2} loadingState={loading}/>
                    <Spacing/>
                    <Input fluid labelPosition="right" type="text" placeholder='download docx file name'
                           onChange={handlerFileName}>
                        <Label content="File Name" basic/>
                        <input/>
                        <Label content=".docx"/>
                    </Input>
                    <Spacing/>
                </div>
                <Spacing/>
                <Spacing/>
                <Button secondary as="a" href="/" content='Home' icon='arrow left' labelPosition='left'/>
                <Button style={{fontFamily: 'charter'}} loading={submitLoading} primary content={"Download..."}
                        onClick={submitHandler}
                        disabled={!activeSubmit}/>
            </div>
        </Container>
    </>);
}

export function AnimatedMulti(props) {
    const animatedComponents = makeAnimated();
    return (
        <Select
            placeholder={"Select tables..."}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            defaultValue={props.selectedOptions}
            onChange={props.selectedOptionsHandler}
            options={props.defaultOptions}
            isLoading={props.loadingState}
        />
    );
}