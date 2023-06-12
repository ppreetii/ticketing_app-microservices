import {useEffect} from "react";
import Router from "next/router";

import userRequest from "../../hooks/user-request";

export default () =>{
    const {doRequest} = userRequest({
        url: "/api/users/signout",
        method: "post",
        body: {},
        onSuccess: () => Router.push("/")
    });

    useEffect(() =>{
        doRequest();
    }, []);

    return <div>Signing Out...</div>
}