import socket

from core.settings import IPPROTO_LUT
from core.settings import trails
from core.enums import TRAIL
from core.events.Event import Event

def plugin(packet, emit_event):
  if packet.protocol not in [socket.IPPROTO_TCP, socket.IPPROTO_UDP]:  # non-TCP/UDP (e.g. ICMP)
    if packet.protocol not in IPPROTO_LUT:
      return

    if packet.protocol == socket.IPPROTO_ICMP:
      if ord(packet.ip_data[packet.iph_length]) != 0x08:  # Non-echo request
        return
    elif packet.protocol == socket.IPPROTO_ICMPV6:
      if ord(packet.ip_data[packet.iph_length]) != 0x80:  # Non-echo request
        return

    if packet.dst_ip in trails:
      emit_event(Event(packet, TRAIL.IP, packet.dst_ip, trails[packet.dst_ip][0], trails[packet.dst_ip][1]))
    elif packet.src_ip in trails:
      emit_event(Event(packet, TRAIL.IP, packet.src_ip, trails[packet.src_ip][0], trails[packet.src_ip][1]))