import axios from 'axios'
declare module '*.mp4' {
    export default string;
}

declare module '*.png' {
    export default string;
}

declare module '*.xlsx' {
    export default string;
}


declare module '*.xlsm' {
    export default string;
}

declare module '*.csv' {
    export default string;
}

declare module 'react-icons/*';

declare module 'uuid';

declare module 'lodash';


// https://github.com/axios/axios/issues/1510#issuecomment-448201698
declare module 'axios' {
    export interface AxiosResponse<T = any> extends Promise<T> { }
}



declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.sass' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.less' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.styl' {
    const classes: { [key: string]: string };
    export default classes;
}