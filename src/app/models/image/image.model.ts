export class Tag {
    id: number;
    name: string;
}

export const availableTagList: Tag[] = [
    { id: 1, name: 'Akshata' },
    { id: 2, name: 'Alanka' },
    { id: 3, name: 'Arun' },
    { id: 4, name: 'Netra' },
    { id: 5, name: 'Shilpa' },
    { id: 4, name: 'Anupama' }

];

export class ImageData {
    imageId: number;
    dataURL: string;
    tags: Tag[];
}