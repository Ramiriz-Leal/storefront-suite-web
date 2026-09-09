import { contactRepository } from "@/data/mockContactRepository";
import { productRepository } from "@/data/mockProductRepository";
import { saleRepository } from "@/data/mockSaleRepository";
import { serviceOrderRepository } from "@/data/mockServiceOrderRepository";
import { ContactService } from "./contactService";
import { PosService } from "./posService";
import { ServiceOrderService } from "./serviceOrderService";

export const contactService = new ContactService(contactRepository);
export const posService = new PosService(saleRepository, productRepository, contactRepository);
export const serviceOrderService = new ServiceOrderService(serviceOrderRepository);
