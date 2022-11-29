export default class LinkBuilderUtil {
    static objectToQuery(object) {
        let arr = [];

        for (let name in object) {
            arr.push(`${name}=${object[name]}`);
        }

        let string = `?${arr[0]}`;
        let i = 1;

        while (i < arr.length) {
            string += `&${arr[i]}`;
            i++;
        }

        return string;
    }
}