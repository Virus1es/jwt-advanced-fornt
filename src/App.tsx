import React, {use, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import UserService from "./services/UserService";
import {IUser} from "./models/IUser";

function App() {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if(localStorage.getItem('token')) {
            void store.checkAuth();
        }
    }, []);

    async function getUsers() {
        try{
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e: any) {
            console.log(e);
        }
    }

    if(store.isLoading) {
        return (
            <div>Загрузка...</div>
        )
    }

    if (!store.isAuth) {
        return (
            <LoginForm/>
        );
    }

    return (
        <div>
            <h1>{store.isAuth ? 'Пользователь авторизован' : 'Авторизуйтесь'}</h1>
            <h1>{store.user.isActivated ? 'Аккаунт активирован' : 'Активируйте аккаунт'}</h1>
            <button onClick={() => store.logout()}>Выйти</button>
            <div>
                <button onClick={getUsers}>
                    Получить список пользователей
                </button>
                {users.map(user =>
                    <div key={user.email}>{user.email}</div>
                )}
            </div>
        </div>
    );
}

export default observer(App);
