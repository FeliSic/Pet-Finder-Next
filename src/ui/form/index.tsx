import styled from "styled-components";
import { Input } from "../text-field";
import { YellowButton } from "../buttons";
import { Subtitle } from "../typography";

export const SubtitleIngresar = styled(Subtitle)``

export const LogInContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #4444;
`;

export const LogInForm = styled.form`
    display: flex;
    width: 400px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background-color: #242424;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FormInput = styled(Input)`
    width: 100%;
    background-color: #000;
    border: 1px solid #fff;
    color: #fff;
`
export const SearcherForm = styled.div`
    display: flex;
    width: 400px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background-color: #242424;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FormButton = styled(YellowButton).attrs(props => ({
    type: props.type || 'button',
}))`
    width: 100%;
    background-color: #F6FFA1;
`;

