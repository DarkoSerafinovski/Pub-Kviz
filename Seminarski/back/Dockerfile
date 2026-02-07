FROM php:8.3-fpm


RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip


RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY php.ini /usr/local/etc/php/conf.d/custom.ini

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www


COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader


COPY . .


RUN composer dump-autoload --optimize
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 8000


CMD php artisan serve --host=0.0.0.0 --port=8000