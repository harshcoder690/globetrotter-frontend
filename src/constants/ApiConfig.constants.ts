interface ApiInterface {
    hostname: string;
    endpoints: {
        [key: string]: string;
    };
}

const ApiConfig: ApiInterface = {
    hostname: process.env.REACT_APP_API_URL ?? "",
    endpoints: {
        validate: "v1/travel-quiz/validate",
        new_challenge: "v1/travel-quiz/new-challenge",
        register: "v1/challenge/register",
        generate: "v1/challenge/generate",
        get_challenge: "v1/challenge/",
    },
};
export default ApiConfig;
