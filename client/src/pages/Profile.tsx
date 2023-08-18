import './Profile.css';

export default function Profile() {
    return (
        <form action='/uploadProfilePicture' method='POST' encType='multipart/form-data'>
            <input type='file' name='profilePicture' />
            <input type='submit' value='Upload' />
        </form>
    );
}