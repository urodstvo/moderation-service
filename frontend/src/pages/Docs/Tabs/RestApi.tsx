const RestApi = () => {
    return (
        <>
        <h1>REST API</h1>
        <section>
            <p>
                Interaction with the service via REST API is performed by sending HTTP requests to the corresponding endpoints of the service and receiving responses in JSON format.
            </p>
        </section>
        <h3>Text Moderation Endpoint</h3>
        <section>
            <div className="code">
                <code>
                    POST url/api/v1/text HTTP
                </code>
            </div>
            <p>
                When making a POST request via url, you need to specify in the body of the request a text field containing a string with the information you want to unmoderate.
            </p>
        </section>
        <h3>Response Model</h3>
        <section>
            <table className="response-table">
                <tr><th>Response Field</th><th>Description</th></tr>
                <tr><td>toxic</td><td></td></tr>
                <tr><td>severe_toxic</td><td></td></tr>
                <tr><td>abuse</td><td></td></tr>
                <tr><td>insult</td><td></td></tr>
                <tr><td>threat</td><td></td></tr>
                <tr><td>identity_hate</td><td></td></tr>
            </table>
        </section>
        </>
    );
};

export default RestApi;