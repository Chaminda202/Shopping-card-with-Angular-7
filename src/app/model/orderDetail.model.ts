import {OrderItemModel} from './orderItem.model';

export interface OrderDetailModel {
  order_id: number;
  customer_id: number;
  customer_name: string;
  delivery_address: string;
  email: string;
  order_items: OrderItemModel[];
}
