export class Utils {
  onImageError( imgElement: HTMLImageElement ) {
    imgElement.src = '/images/no-image-found-design.webp';
  }
}
