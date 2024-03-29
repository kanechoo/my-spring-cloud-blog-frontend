import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useHistory} from "react-router";
import {Button, Container, Form, Grid, GridColumn, GridRow, Message, Segment,} from "semantic-ui-react";
import API from "../../data/DataUrl";
import {CustomButton} from "../Components";
import Spacing from "../Spacing";

export default function Upload() {
    const history = useHistory();
    const backToSignIn = () => {
        history.push("/man/signIn");
    };
    const axios = require("axios").default;
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response.status === 401) {
                backToSignIn();
            }
        }
    );
    const accessToken = Cookies.get("access_token");
    const username = Cookies.get("username");
    useEffect(() => {
        if (!accessToken || !username) {
            backToSignIn();
        }
    }, []);
    const [message, setMessage] = useState();
    const uploadFileEvent = () => {
        const formData = new FormData();
        const fileField = document.querySelector("#files");
        if (!(Array.from(fileField.files).length > 0)) {
            setMessage("Please select your mackdown file");
        } else {
            Array.from(fileField.files).forEach((f) => {
                formData.append("files", f);
            });
            axios
                .post(API.ADMIN_POSTS_UPLOAD_URL, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    setMessage(res.data.message);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    };
    const uploadForm = () => (
        <>
            <Container style={{marginTop: "25vh"}}>
                <Grid textAlign="center">
                    <GridRow>
                        <GridColumn width={6}>
                            <Segment textAlign="left">
                                <Form>
                                    <Form.Field>
                                        <label htmlFor="" style={{fontSize: "15px"}}>
                                            Select your markdown file to upload
                                        </label>
                                        <input
                                            id="files"
                                            type="file"
                                            name="files"
                                            multiple="multiple"
                                            accept=".md"
                                        />
                                    </Form.Field>
                                    <CustomButton
                                        content="Submit"
                                        onClick={uploadFileEvent}
                                        bold
                                        height={32}
                                        border={1}
                                    />
                                </Form>
                                {message && <Message as="h4">{message}</Message>}
                            </Segment>
                            <Spacing/>
                            <Button secondary as="a" href="/man/posts/" content='Back Manage Page' size={"small"} icon='arrow left' labelPosition='left'/>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </Container>
        </>
    );
    return (
        <>
            <Container>
                {uploadForm()}
                {/* {enableDarkReader()} */}
            </Container>
        </>
    );
}
